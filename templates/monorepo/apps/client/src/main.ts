import './style.css'
import { formatCurrency, add } from '@packages/utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <p>Using utils package:</p>
      <p>2 + 3 = ${add(2, 3)}</p>
      <p>Format $1234.56: ${formatCurrency(1234.56)}</p>
      <button id="counter" type="button">Count is 0</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `Count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)