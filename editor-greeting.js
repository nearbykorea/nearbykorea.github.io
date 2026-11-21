class EditorGreeting extends HTMLElement {
  connectedCallback() {
    if (this.firstElementChild) return;
    this.innerHTML = `
      <p class="greeting-verse" lang="ko">세상 모든 것 가운데 사람이 제일 <span class="verse-end">귀하니<sup><a href="#editor-verse-source" role="doc-noteref" aria-label="Source note 1 · 출처 각주 1">1</a></sup></span></p>
      <p class="greeting-translation" lang="en-GB">Nothing in this world is more precious than a person.</p>
      <p class="greeting-meal" lang="ko">오늘 밥은 잘 챙겨 드셨어요?</p>
      <p class="greeting-meal" lang="en-GB">Have you had something to eat today?</p>
      <p class="greeting-credit"><span lang="ko">편집자 드림</span><span lang="en-GB">From the editor</span></p>
      <aside id="editor-verse-source" tabindex="-1" role="doc-footnote" lang="en-GB" aria-label="Source note 1"><span aria-hidden="true">1</span>
        <p>Park In-ro’s <cite><a href="https://encykorea.aks.ac.kr/Article/E0038209" target="_blank" rel="noopener noreferrer">Oryun-ga</a></cite> in modern Korean, from Kim Jeong-sun’s handwritten copy.</p>
      </aside>`;

    // The reader uses the URL fragment for its current page.
    this.querySelector('[role="doc-noteref"]').addEventListener('click', event => {
      event.preventDefault();
      const note = this.querySelector('[role="doc-footnote"]');
      note.focus({ preventScroll: true });
      note.scrollIntoView({ block: 'nearest' });
    });
  }
}

customElements.define('editor-greeting', EditorGreeting);
