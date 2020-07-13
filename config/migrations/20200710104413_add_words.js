
exports.up = function(knex) {
  return knex.schema.createTable('words', (t) => {
    t.increments('id').unsigned().primary();
    t.string('rus', 50).notNull();
    t.string('translation', 50).notNull();
    t.string('language', 5).defaultTo('en');
    t.integer('points').unsigned().notNull();
    t.dateTime('createdAt').notNull();
    t.dateTime('updatedAt').notNull();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('words');
};
