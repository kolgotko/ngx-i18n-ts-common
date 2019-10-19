import * as fs from 'fs';
import * as xmljs from 'xml-js';
import { get, keyBy } from 'lodash';

export const loadTransUnitMap = (file: string) => {
  const xml = fs.readFileSync(file, 'utf8');
  const xliffParsed = xmljs.xml2js(xml);
  const transUnitList = get(xliffParsed, 'elements[0].elements[0].elements[0].elements', []);

  return keyBy(transUnitList, unit => unit.attributes.id);
}
