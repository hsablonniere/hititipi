// language=CSS
export default `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    margin: 2rem;
  }

  @media screen and (max-width: 40rem) {
    body {
      margin: 1rem;
    }
  }

  .list {
    margin: 0 auto;
    max-width: 60rem;
    width: 100%;
  }

  .entry {
    --bdrs: 0.375rem;
    --gap: 1rem;
    border: 1px solid #d1d9e0;
    border-bottom-width: 0;
    color: #1f2328;
    display: flex;
    gap: var(--gap);
    font-size: 0.875rem;
    padding: calc(var(--gap) / 1.5) var(--gap)
  }

  @media screen and (max-width: 40rem) {
    .entry {
      padding: calc(var(--gap) / 2) var(--gap);
    }
  }

  .entry:first-child {
    border-radius: var(--bdrs) var(--bdrs) 0 0;
  }

  .entry:last-child {
    border-radius: 0 0 var(--bdrs) var(--bdrs);
    border-bottom-width: 1px;
  }

  .entry.head {
    background-color: #f6f8fa;
  }

  .entry:not(.head):not(.empty):hover {
    background-color: #fafafa;
  }

  .entry.head a {
    font-weight: bold;
  }
  
  .entry.empty {
    color: #59636e;
    font-style: italic;
  }

  .details {
    display: flex;
    gap: calc(var(--gap) / 5) var(--gap);
    flex: 1 1 0;
  }

  @media screen and (max-width: 40rem) {
    .details {
      flex-direction: column;
    }
  }

  .name {
    flex: 1 1 0;
  }
  
  .name.is-hidden {
    font-style: italic;
  }

  .size,
  .date {
    color: #59636e;
    text-align: right;
  }

  .size {
    min-width: 6rem;
  }

  .date {
    min-width: 12rem;
  }

  @media screen and (max-width: 40rem) {
    .size,
    .date {
      min-width: 0;
      text-align: left;
    }
  }

  a {
    color: #1f2328;
    text-decoration: none;
  }

  a:hover:not(.no-underline) {
    color: #0969da;
    text-decoration: underline;
  }

  .separator {
    padding: 0 0.25rem;
  }
`;
