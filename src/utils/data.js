const categoryTypes = [
  {
    label: 'Men',
    value: 'men'
  },
  {
    label: 'Women',
    value: 'women'
  },
  {
    label: 'Kids',
    value: 'kids'
  }
];

const getFileNameByPath = filePath => {
  if (filePath) {
    let fileArray = filePath.split('/');
    let fileName = fileArray && fileArray[3] ? fileArray[3] : '';
    return fileName;
  }
};
export { categoryTypes, getFileNameByPath };
