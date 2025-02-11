let ENV = {};

const files = import.meta.glob('./*.json');
for (const file in files) {
  try {
    const res = await files[file]();
    if ('default' in res) ENV = Object.assign(ENV, res.default)
  } catch (e) {}
}

export default ENV;
