/* ======================== DATA ACCESS LAYER ======================== */
/* Single abstraction over all data tables in data/.                   */
/* Consumers call DataLayer.getLesson(), .getVocabulary(), etc.       */
/* Backend can be swapped from JSON files to API without changing      */
/* any consumer code.                                                  */
/* =================================================================== */
(function () {
  'use strict';

  // ---- Table definitions ----
  var TABLE_NAMES = [
    'sections', 'vocabulary', 'phrases', 'fill-blanks',
    'passages', 'questions', 'intros', 'visual-vocab', 'practice'
  ];

  // ---- Cache ----
  var _cache = {};   // tableName -> Array (resolved data)
  var _pending = {}; // tableName -> Promise (in-flight requests)

  // ---- Path resolution ----
  function resolveRoot() {
    var depth = parseInt(document.body.dataset.depth || '0', 10);
    var prefix = document.body.dataset.prefix || '';
    return (depth === 0 ? './' : '../'.repeat(depth)) + prefix;
  }

  function tablePath(name) {
    return resolveRoot() + 'data/' + name + '.json';
  }

  // ---- Fetch a single table ----
  function loadTable(name) {
    if (_cache[name]) return Promise.resolve(_cache[name]);
    if (_pending[name]) return _pending[name];

    var promise = fetch(tablePath(name))
      .then(function (r) { return r.json(); })
      .then(function (rows) {
        _cache[name] = rows;
        delete _pending[name];
        return rows;
      })
      .catch(function (err) {
        console.warn('DataLayer: failed to load ' + name, err);
        delete _pending[name];
        _cache[name] = [];
        return [];
      });

    _pending[name] = promise;
    return promise;
  }

  // ---- Name lookup (section slug → display name) ----
  var _nameMap = null; // built lazily from sections table
  function buildNameMap(sections) {
    if (_nameMap) return;
    _nameMap = {};
    sections.forEach(function (s) { _nameMap[s.skill + '/' + s.section] = s.name; });
  }
  function lessonName(skill, section) {
    return _nameMap ? (_nameMap[skill + '/' + section] || section) : section;
  }

  /**
   * Enrich rows with _lesson (display name) and _skill (alias for skill).
   * Used by cross-lesson query methods for backward compat with hub pages.
   */
  function enrich(rows) {
    return rows.map(function (r) {
      r._lesson = lessonName(r.skill, r.section);
      r._skill = r.skill;
      return r;
    });
  }

  // ---- Filtering ----
  function applyFilter(rows, filter) {
    if (!filter) return rows;
    return rows.filter(function (r) {
      if (filter.skill && r.skill !== filter.skill) return false;
      if (filter.section && r.section !== filter.section) return false;
      if (filter.category && r.category !== filter.category) return false;
      return true;
    });
  }

  function bySection(rows, skill, section) {
    return rows.filter(function (r) {
      return r.skill === skill && r.section === section;
    });
  }

  // ---- Public API ----
  window.DataLayer = {

    /**
     * Get assembled lesson data (shaped like the old data.json).
     * @param {string} skill - 'reading' or 'listening'
     * @param {string} section - e.g. 'happiness', 'map-labeling'
     * @returns {Promise<Object>}
     */
    getLesson: function (skill, section) {
      // Load only the tables this skill type needs
      var needed = ['vocabulary', 'phrases', 'fill-blanks'];
      if (skill === 'reading') {
        needed.push('passages', 'questions');
      } else if (skill === 'listening') {
        needed.push('intros', 'visual-vocab', 'practice');
      }

      return Promise.all(needed.map(loadTable)).then(function () {
        var lesson = {};

        // Vocabulary
        lesson.vocabulary = bySection(_cache.vocabulary || [], skill, section);

        // Phrases
        lesson.usefulPhrases = bySection(_cache.phrases || [], skill, section);

        // Fill-blanks
        lesson.fillBlanks = bySection(_cache['fill-blanks'] || [], skill, section);

        // Reading-specific
        if (skill === 'reading') {
          lesson.sections = bySection(_cache.passages || [], skill, section);

          var allQ = _cache.questions || [];
          var sectionQ = bySection(allQ, skill, section);
          lesson.ieltsQuestions = sectionQ.filter(function (q) { return !q.type; });

          var qtMeta = sectionQ.find(function (q) {
            return q.type === 'meta' && q.key === 'questionTypes';
          });
          lesson.questionTypes = qtMeta ? qtMeta.value : null;

          var sqMeta = sectionQ.find(function (q) {
            return q.type === 'meta' && q.key === 'summaryQuestions';
          });
          lesson.summaryQuestions = sqMeta ? sqMeta.value : null;
        }

        // Listening-specific
        if (skill === 'listening') {
          var intros = bySection(_cache.intros || [], skill, section);
          lesson.intro = intros[0] || null;

          lesson.visualVocab = bySection(_cache['visual-vocab'] || [], skill, section);

          var practices = bySection(_cache.practice || [], skill, section);
          lesson.practice = practices[0] || null;
        }

        return lesson;
      });
    },

    /**
     * Query the sections/registry table.
     * @param {Object} [filter] - {skill?, section?}
     * @returns {Promise<Array>}
     */
    getSections: function (filter) {
      return loadTable('sections').then(function (rows) {
        return applyFilter(rows, filter);
      });
    },

    /**
     * Get vocabulary across all lessons.
     * @param {Object} [filter] - {skill?, section?, cat?}
     * @returns {Promise<Array>}
     */
    getVocabulary: function (filter) {
      return Promise.all([loadTable('vocabulary'), loadTable('sections')]).then(function (res) {
        buildNameMap(res[1]);
        return applyFilter(enrich(res[0]), filter);
      });
    },

    /**
     * Get phrases across all lessons.
     * @param {Object} [filter] - {skill?, section?, cat?}
     * @returns {Promise<Array>}
     */
    getPhrases: function (filter) {
      return Promise.all([loadTable('phrases'), loadTable('sections')]).then(function (res) {
        buildNameMap(res[1]);
        return applyFilter(enrich(res[0]), filter);
      });
    },

    /**
     * Get fill-blanks across all lessons.
     * @param {Object} [filter] - {skill?, section?, cat?}
     * @returns {Promise<Array>}
     */
    getFillBlanks: function (filter) {
      return Promise.all([loadTable('fill-blanks'), loadTable('sections')]).then(function (res) {
        buildNameMap(res[1]);
        return applyFilter(enrich(res[0]), filter);
      });
    },

    /**
     * Get reading passages.
     * @param {Object} [filter] - {skill?, section?}
     * @returns {Promise<Array>}
     */
    getPassages: function (filter) {
      return loadTable('passages').then(function (rows) {
        return applyFilter(rows, filter);
      });
    },

    /**
     * Get IELTS questions (excludes meta records).
     * @param {Object} [filter] - {skill?, section?}
     * @returns {Promise<Array>}
     */
    getQuestions: function (filter) {
      return loadTable('questions').then(function (rows) {
        return applyFilter(rows.filter(function (q) { return !q.type; }), filter);
      });
    },

    /**
     * Get listening intros.
     * @param {Object} [filter] - {skill?, section?}
     * @returns {Promise<Array>}
     */
    getIntros: function (filter) {
      return loadTable('intros').then(function (rows) {
        return applyFilter(rows, filter);
      });
    },

    /**
     * Get listening visual vocab.
     * @param {Object} [filter] - {skill?, section?}
     * @returns {Promise<Array>}
     */
    getVisualVocab: function (filter) {
      return loadTable('visual-vocab').then(function (rows) {
        return applyFilter(rows, filter);
      });
    },

    /**
     * Get listening practice data.
     * @param {Object} [filter] - {skill?, section?}
     * @returns {Promise<Array>}
     */
    getPractice: function (filter) {
      return loadTable('practice').then(function (rows) {
        return applyFilter(rows, filter);
      });
    },

    /**
     * Preload all tables into cache.
     * @returns {Promise<void>}
     */
    preloadAll: function () {
      return Promise.all(TABLE_NAMES.map(loadTable)).then(function () {});
    }
  };
})();
