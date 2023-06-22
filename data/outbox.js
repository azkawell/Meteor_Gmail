import {Mongo} from 'meteor/mongo';

export const Outbox = new Mongo.Collection('outbox');