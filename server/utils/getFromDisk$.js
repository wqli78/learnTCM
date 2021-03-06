import path from 'path';
import { Observable } from 'rx';
import adler32 from 'adler32';

// import lwqtr from './lwq';
var lwqtr = require('transliteration');

const basePath = process.cwd() + '/seed/challenges/';

export default function getFromDisk$(challenge) {
  if (challenge && !challenge.fileName) {
    throw new Error(
      `Challenge ${challenge.name} has no fileName.
      Did you remember run node seed?`
    );
  }
  
  //删除模块cache中的对应模块，可以实现动态加载
  delete require.cache[require.resolve(
    path.join(basePath, challenge.fileName)
  )];

  return Observable.just(require(path.join(basePath, challenge.fileName)))
    .map(challengeSpec => {
      const _challenge = challengeSpec.challenges[challenge.suborder - 1];
      _challenge.helpRoom = challengeSpec.helpRoom || 'learnTCM';
      return _challenge;
    })
    .map(challenge => {
      challenge.checksum = adler32.sum(
        Buffer(challenge.title +
          JSON.stringify(challenge.description) +
          JSON.stringify(challenge.challengeSeed) +
          JSON.stringify(challenge.tests)));

      challenge.head = challenge.head || [];
      challenge.tail = challenge.tail || [];
      challenge.challengeType = '' + challenge.challengeType;

      challenge.name = lwqtr(challenge.title).replace(/[^a-zA-Z0-9\s]/g, '');

      challenge.dashedName = challenge.name
        .toLowerCase()
        .replace(/\:/g, '')
        .replace(/\s/g, '-');

      return challenge;
    });
}
