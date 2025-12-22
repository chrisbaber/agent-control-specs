const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const adpSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'schemas/adp-1.schema.json'), 'utf8'));
const pvsSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'schemas/pvs-1.schema.json'), 'utf8'));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

console.log('Compiling ADP-1 Schema...');
try {
    ajv.compile(adpSchema);
    console.log('ADP-1 Success');
} catch (e) {
    console.error('ADP-1 Failed:', e.message);
}

console.log('Compiling PVS-1 Schema...');
try {
    const ajv2 = new Ajv({ allErrors: true });
    addFormats(ajv2);
    ajv2.compile(pvsSchema);
    console.log('PVS-1 Success');
} catch (e) {
    console.error('PVS-1 Failed:', e.message);
}
