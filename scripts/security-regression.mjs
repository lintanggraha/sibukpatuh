import assert from 'node:assert/strict';
import breach from '../api/breach.js';
import gemini from '../api/gemini.js';
import misp from '../api/misp.js';
import mitre from '../api/mitre.js';
import otx from '../api/otx.js';
import pulsedive from '../api/pulsedive.js';

function responseMock() {
  const state = { statusCode: 200, headers: {}, body: undefined, ended: false };
  const res = {
    setHeader(name, value) { state.headers[name] = value; },
    status(code) { state.statusCode = code; return this; },
    json(body) { state.body = body; return this; },
    send(body) { state.body = body; return this; },
    end() { state.ended = true; return this; },
  };
  return { res, state };
}

async function call(handler, req) {
  const { res, state } = responseMock();
  await handler(req, res);
  return state;
}

const base = { headers: { origin: 'http://localhost:4173' }, socket: { remoteAddress: '127.0.0.1' } };

let result = await call(breach, { ...base, method: 'GET', query: {} });
assert.equal(result.statusCode, 400);

process.env.GEMINI_KEY = 'test-only-not-used';
result = await call(gemini, { ...base, method: 'POST', body: { messages: [] } });
assert.equal(result.statusCode, 400);

authorizeMisp();
result = await call(misp, { ...base, method: 'POST', body: { path: '/users' } });
assert.equal(result.statusCode, 400);

result = await call(mitre, { ...base, method: 'GET', query: { path: 'https://evil.example/' } });
assert.equal(result.statusCode, 400);

result = await call(otx, { ...base, method: 'GET', url: '/api/otx?mode=unknown', query: {} });
assert.equal(result.statusCode, 400);

result = await call(pulsedive, { ...base, method: 'GET', query: {} });
assert.equal(result.statusCode, 400);

result = await call(breach, { headers: {}, method: 'GET', query: {} });
assert.equal(result.statusCode, 403);

console.log('security regression checks passed');

function authorizeMisp() {
  process.env.MISP_URL = 'https://misp.example';
  process.env.MISP_KEY = 'test-only-not-used';
}
