// @flow

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const viewTheme = {
    ".padder": {
      padding: variables.contentPadding
    },
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation:4 
  };

  return viewTheme;
};
