const graphql = require('graphql');

const createNumerator = (from) => {
  let i = from - 1;
  return () => ++i;
};

let words = [
  { id: 1, userId: 1, rus: "Несмотря на это", translation: "Despite this", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.862Z", updatedAt: "2020-07-10T10:14:20.862Z" },
  { id: 2, userId: 1, rus: "Предлагать", translation: "Suggest", language: "en", points: 5, isLearned: false, createdAt: "2020-07-10T10:14:20.863Z", updatedAt: "2020-07-10T10:14:20.863Z" },
  { id: 3, userId: 2, rus: "Поддерживать", translation: "Maintain", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.863Z", updatedAt: "2020-07-10T10:14:20.863Z" },
  { id: 4, userId: 2, rus: "Дело", translation: "Affair", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.863Z", updatedAt: "2020-07-10T10:14:20.863Z" },
  { id: 5, userId: 1, rus: "Недавно", translation: "Recently", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.863Z", updatedAt: "2020-07-10T10:14:20.863Z" },
  { id: 6, userId: 1, rus: "Количество, сумма", translation: "Amount", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.863Z", updatedAt: "2020-07-10T10:14:20.863Z" },
  { id: 7, userId: 2, rus: "И.О.", translation: "Acting comissioner", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.863Z", updatedAt: "2020-07-10T10:14:20.863Z" },
  { id: 8, userId: 1, rus: "Осуществлять", translation: "Implement", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.863Z", updatedAt: "2020-07-10T10:14:20.863Z" },
  { id: 9, userId: 2, rus: "Вместо", translation: "In place of", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.864Z", updatedAt: "2020-07-10T10:14:20.864Z" },
  { id: 10, userId: 2, rus: "Вред, вредить", translation: "Harm", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.864Z", updatedAt: "2020-07-10T10:14:20.864Z" },
  { id: 11, userId: 1, rus: "Как с ... так с ...", translation: "Both ... and ...", language: "en", points: 5, isLearned: true, createdAt: "2020-07-10T10:14:20.864Z", updatedAt: "2020-07-10T10:14:20.864Z" }
];

const wordIdGen = createNumerator(12);

let users = [
  { id: 1, name: 'Elon' },
  { id: 2, name: 'Eminem' }
];

const userOdGen = createNumerator(3);

const {
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} = graphql;

const WordType = new GraphQLObjectType({
  name: 'Word',
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    rus: { type: GraphQLString },
    translation: { type: GraphQLString },
    language: { type: GraphQLString },
    points: { type: GraphQLInt },
    isLearned: { type: GraphQLBoolean }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    words: {
      type: new GraphQLList(WordType),
      resolve(parent) {
        return words.filter(w => w.userId == parent.id);
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    word: {
      type: WordType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return words.find(word => word.id == args.id);
      },
    },
    words: {
      type: GraphQLList(WordType),
      resolve() {
        return words;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return users.find(u => u.id == args.id)
      },
    },
    users: {
      type: GraphQLList(UserType),
      resolve() {
        return users;
      },
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addWord: {
      type: WordType,
      args: {
        rus: { type: GraphQLNonNull(GraphQLString) },
        translation: { type: GraphQLNonNull(GraphQLString) },
        language: { type: GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { rus, translation, language, userId }) {
        const time = new Date();
        const word = {
          id: wordIdGen(),
          rus,
          translation,
          language,
          userId,
          isLearned: false,
          points: 0,
          createdAt: time,
          updatedAt: time
        };
        words.push(word);
        return word;
      }
    },
    updateWord: {
      type: WordType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        rus: { type: GraphQLString },
        translation: { type: GraphQLString },
        language: { type: GraphQLString }
      },
      resolve(_, { id, rus, translation, language }) {
        const index = words.findIndex(x => x.id == id);
        if (index === -1) throw new Error('Word not found');
        if (rus) words[index].rus = rus;
        if (translation) words[index].translation = translation;
        if (language) words[index].language = language;
        words[index].updatedAt = new Date();
        return words[index];
      }
    },
    deleteWord: {
      type: WordType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { id }) {
        const index = words.findIndex(x => x.id == id);
        if (index === -1) throw new Error('Word not found');
        words = [...words.slice(0, index), ...words.slice(index + 1, words.length)];
        return {};
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
