import moment from 'moment-jalaali';

export const formatDate = (isoString: string): string => {
  return moment(isoString).format('jYYYY/jMM/jDD');
};