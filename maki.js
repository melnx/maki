var config = require('./config');

var Maki = require('./lib/Maki');
var maki = new Maki( config );

maki.define('Person', {
  attributes: {
    username: { type: String , max: 80 , required: true , slug: true },
    hash:     { type: String , restricted: true },
    salt:     { type: String , restricted: true },
    email:    { type: String , max: 80 , restricted: true },
    created:  { type: Date , default: Date.now }
  },
  plugins: [
    require('passport-local-mongoose')
  ],
  icon: 'user'
});

maki.define('Example', {
  attributes: {
    name:    { type: String , max: 80 },
    slug:    { type: String , max: 80 , id: true },
    content: { type: String },
    screenshot: { type: 'File' }
  },
  source: 'data/examples.json',
  icon: 'idea'
});

maki.define('Release', {
  attributes: {
    name: { type: String , max: 80 },
    tag: { type: String , max: 80 },
    created: { type: Date },
    published: { type: Date },
    notes: { type: String , render: 'markdown' }
  },
  source: 'https://api.github.com/repos/martindale/maki/releases',
  icon: 'tags',
  map: function( release ) {
    return {
      name: release.name,
      tag: release.tag_name,
      notes: release.body,
      published: new Date( release.published_at )
    };
  }
});

maki.define('Dashboard', {
  attributes: {
      name: { type: String , max: 80 , name: true , slug: true , required: true }
    , _people: { type: require('mongoose').SchemaTypes.ObjectId, ref: 'Person' }
  },
  requires: {
    'examples': {},
    'people': {
      filter: {
        // _id: { $in: dashboard._people }
      }
    }
  },
  icon: 'dashboard'
});

maki.define('Widget', {
  attributes: {
    name: { type: String , max: 80 },
    stuff: {
      foo: String ,
      bar: { type: String , enum: ['lol', 'wut'] }
    },
    tinker: {
      type: 'Mixed'
    }
  },
  icon: 'setting'
});

maki.serve(['http']).start();
