const randStr = () => Math.random().toString(36).substr(2);

const supplyFunc = (str, len) => {
    if(str.length > len) return str.substr(0, len);
    if(str.length < len) return supplyFunc(str + randStr(), len);
    return str;
  }

  const str10 = () => supplyFunc(randStr(), 10);