const formatHeader = (header: string) => {
  return header
    .split(/_|-/)
    .map((x) => x.toLowerCase())
    .join('-');
};

export const HeadersFormatService = {
  call: (header: string) => {
    if (!header) {
      return '';
    }
    return formatHeader(header.replace(/^HTTP(?:_|-)/i, ''));
  },
};
