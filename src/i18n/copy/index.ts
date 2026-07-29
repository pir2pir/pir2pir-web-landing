import type {Locale} from '../locale';
import {en} from './en';
import {ru} from './ru';
import type {Copy} from './types';
import {uz} from './uz';

export const COPY: Record<Locale, Copy> = {ru, en, uz};

export type {Copy, LinkedText} from './types';
