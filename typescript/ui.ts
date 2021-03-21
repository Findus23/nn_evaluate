import {calculate_grid} from "./calc";
import {valuesToImage} from "./utils";
import throttle from "lodash/throttle"

export const massExpEl = <HTMLInputElement>document.getElementById("massExp")
export const gammaPercentEl = <HTMLInputElement>document.getElementById("gammaPercent")
export const wtFractionEl = <HTMLInputElement>document.getElementById("wtFraction")
export const wpFractionEl = <HTMLInputElement>document.getElementById("wpFraction")
export const resolutionEl = <HTMLInputElement>document.getElementById("resolution")
export const smoothEl = <HTMLInputElement>document.getElementById("smooth")
export const modeEl = <HTMLSelectElement>document.getElementById("mode")
export const massExpLabel = document.getElementById("massExpLabel")
export const gammaPercentLabel = document.getElementById("gammaPercentLabel")
export const resolutionLabel = document.getElementById("resolutionLabel")
export const wtFractionLabel = document.getElementById("wtFractionLabel")
export const wpFractionLabel = document.getElementById("wpFractionLabel")
export const canvas = <HTMLCanvasElement>document.getElementById("outputCanvas")

function update(): void {
    if (smoothEl.checked) {
        canvas.classList.remove("crisp")
    } else {
        canvas.classList.add("crisp")
    }

    const mass = Math.pow(10, Number(massExpEl.value))
    massExpLabel.innerText = String(mass) + " kg"
    const gamma = Number(gammaPercentEl.value) / 100
    gammaPercentLabel.innerText = String(gamma)
    const wtFraction = Math.pow(10, Number(wtFractionEl.value))
    wtFractionLabel.innerText = String(wtFraction)
    const wpFraction = Math.pow(10, Number(wpFractionEl.value))
    wpFractionLabel.innerText = String(wpFraction)
    const resolution = Number(resolutionEl.value)
    resolutionLabel.innerText = String(resolution) + " px"
    const mode = Number(modeEl.value)
    const output = calculate_grid(mass, gamma, wpFraction, wtFraction, resolution, mode)
    const image = new ImageData(valuesToImage(output), resolution, resolution)
    const context = canvas.getContext('2d')
    context.canvas.width = resolution;
    context.canvas.height = resolution;
    context.putImageData(image, 0, 0);


}

export function init(): void {
    const start = performance.now()
    update()
    const end = performance.now()
    const testTime = end - start
    console.info(`initial run took ${testTime}ms`)
    const throttled = throttle(update, testTime)
    const type = (testTime > 500) ? "change" : "input"
    massExpEl.addEventListener(type, throttled)
    gammaPercentEl.addEventListener(type, throttled)
    wtFractionEl.addEventListener(type, throttled)
    wpFractionEl.addEventListener(type, throttled)
    resolutionEl.addEventListener(type, throttled)
    smoothEl.addEventListener("change", throttled)
    modeEl.addEventListener("change", throttled)
}
