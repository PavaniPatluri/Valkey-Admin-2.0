import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

async function test() {
  const result = streamText({
    model: groq('llama3-8b-8192'),
    prompt: 'hello'
  });
  const proto = Object.getPrototypeOf(result);
  console.log('Prototype keys:', Object.getOwnPropertyNames(proto));
}

test();
