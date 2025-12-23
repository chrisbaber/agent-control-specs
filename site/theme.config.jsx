export default {
  logo: <span>AControlLayer</span>,
  project: {
    link: 'https://github.com/chrisbaber/agent-control-specs'
  },
  docsRepositoryBase: 'https://github.com/chrisbaber/agent-control-specs/blob/main',
  footer: {
    text: 'Agent Control Specs'
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Agent Control Specs'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Agent Control Specs" />
      <meta property="og:description" content="AControlLayer Standards" />
    </>
  ),
  primaryHue: 45, // Gold-ish
  primarySaturation: 60
}
