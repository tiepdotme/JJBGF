import moment from 'moment';
moment.locale('de');

export const ByDate = (order = 'DESC') => {
  return (pageA, pageB) => {
    const dateA = moment(pageA.frontmatter.date);
    const dateB = moment(pageB.frontmatter.date);

    if (order === 'DESC') {
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      if (dateA === dateB) return 0;
    } else if (order === 'ASC') {
      if (dateA > dateB) return 1;
      if (dateA < dateB) return -1;
      if (dateA === dateB) return 0;
    } else {
      throw new Error('unexpected order!');
    }
  };
};

export const OnlyYear = year => {
  return page => {
    const pageYear = moment(page.frontmatter.date).format('YYYY');
    return pageYear == year;
  };
};

export const EventPages = $site => {
  return $site.pages.filter(page => page.frontmatter.layout === 'EventPage');
};
