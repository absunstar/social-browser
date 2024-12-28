if (document.location.href.like('*youtube-view?url=*')) {
    delete window.location;
  SOCIALBROWSER.__define(window, 'location', {
    ancestorOrigins: {},
    href: 'https://www.youtube.com/watch?v=LtOFKKe7074',
    origin: 'https://www.youtube.com',
    protocol: 'https:',
    host: 'www.youtube.com',
    hostname: 'www.youtube.com',
    port: '',
    pathname: '/watch',
    search: '?v=LtOFKKe7074',
    hash: '',
  });
}
