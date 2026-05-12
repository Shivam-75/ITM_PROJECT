import { config } from 'dotenv';
import fs from 'fs';

fs.writeFileSync('.test.env', 'KEY =VALUE\nKEY2= VALUE2\n KEY3 = VALUE3 ');
config({ path: '.test.env' });

console.log('KEY:', process.env.KEY);
console.log('KEY2:', process.env.KEY2);
console.log('KEY3:', process.env.KEY3);
console.log('KEY_WITH_SPACE:', process.env['KEY ']);
