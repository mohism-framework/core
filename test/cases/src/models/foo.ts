import Model from '../../../../src/engine/database/mongo/modelFactory';

const Foo = {
  name: {
    type: String,
  },
  age: {
    type: Number,
    default: 18,
  }
};

export default Model('t_foo', Foo);