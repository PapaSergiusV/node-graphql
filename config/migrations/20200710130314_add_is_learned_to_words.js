
exports.up = function(knex) {
  return knex.schema.table('words', (t) => {
    t.boolean('isLearned').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('words', (t) => {
    t.dropColumn('isLearned');
  });
};
