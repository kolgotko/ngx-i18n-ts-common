import * as ts from 'typescript';
import * as path from 'path';
import * as glob from 'glob';

export function createProgram(dirList: Array<string>, ignore: Array<string> = []): ts.Program {
  const fileList = dirList.reduce((acc, dir) => [
    ...acc,
    ...glob.sync(path.join(dir, '/**/*.ts'), { ignore }),
  ], []);

  return ts.createProgram(fileList, {});
}
