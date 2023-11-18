import {ParamsDictionary} from 'express-serve-static-core';


export type ParamsOffer = {
  offerId: string;
} | ParamsDictionary

export type ParamsCity = {
  city: string;
}| ParamsDictionary

export type ParamsOffersCount = {
  count: string;
}| ParamsDictionary
