export const transformList = (list, valueField, labelField) => {
  if (!Array.isArray(list)) {
    throw new Error('Input must be an array');
  }

  if (!valueField || !labelField) {
    throw new Error('Both valueField and labelField must be provided');
  }

  return list.map((item) => {
    const transformedItem = {
      value: item[valueField],
      label: item[labelField],
    };

    return transformedItem;
  });
};
