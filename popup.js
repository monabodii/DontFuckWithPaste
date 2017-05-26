(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const cancel = document.querySelector('.cancel');
    const container = document.querySelector('.container');
    const form = document.querySelector('.form');
    let rules = new DFWP.Rules();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      DFWP.storage.set({ rules: rules.serialize() });
      window.close();
    });

    cancel.addEventListener('click', (event) => {
      window.close();
    });

    DFWP.storage.get({ rules: [] }, ({ rules: values }) => {
      rules = DFWP.Rules.deserialize(values);

      chrome.tabs.query({active: true}, ([tab, ...rest]) => {
        let rule = rules.find((r) => r.test(tab.url));

        if (!rule) {
          rule = new DFWP.Rule(new URL(tab.url).origin);
          rules.add(rule);
        }

        new DFWP.RuleView(rule, rules).render(container);
      });
    });

  });
})();
