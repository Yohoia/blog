/** 点击微信联系方式后复制用户提供的号码。 */
export function registerTerminalContacts(): void {
  if (customElements.get('terminal-contacts')) return;

  class TerminalContacts extends HTMLElement {
    private controller?: AbortController;

    connectedCallback() {
      this.controller = new AbortController();
      this.addEventListener('click', this.copyContact, {
        signal: this.controller.signal,
      });
    }

    disconnectedCallback() {
      this.controller?.abort();
    }

    private copyContact = async (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>(
        '[data-copy-contact]',
      );
      const value = button?.dataset.copyContact;
      const status = this.querySelector('[data-copy-status]');
      if (!button || !value || !status) return;
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(value);
        if (this.isConnected)
          status.textContent = button.dataset.copySuccess ?? '';
      } catch {
        if (this.isConnected)
          status.textContent = button.dataset.copyFailed ?? '';
      }
    };
  }

  customElements.define('terminal-contacts', TerminalContacts);
}
