import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

let muteList: string[] = []
storage.watch({
    "userList": (c) => {
        muteList = c.newValue
    }
});

(async () => {
    muteList = await storage.get("userList")
    if (!Array.isArray(muteList)) {
        muteList = []
    }
})()


export const config: PlasmoCSConfig = {
    matches: ["https://asobistage.asobistore.jp/*"],
    all_frames: true
}

let target: Element | null = null
const setObserver = (): boolean => {

    target = document.querySelector("div[class^='commentViewer_commentList__'] > div:nth-child(2) > div > div")
    if (!target) {
        target = document.querySelector("*[data-test-id='virtuoso-item-list']")
    }
    if (!target) {
        return false
    }

    console.log("[asobi-mute] start comment watching!")

    const observer = new MutationObserver(function (mutations) {
        for (var m of mutations) {
            for (var comment of m.addedNodes) {
                const element = comment as any
                var name = element.querySelector("*[class*='item_nickName_link']")
                var text = element.querySelector("*[class*='item_comment']")
                if (!name || !text) {
                    continue
                }

                if (muteList.includes(name.innerText)) {
                    name.innerText = ""
                    text.innerHTML = "<i style='color: #666;'>muted</i>"
                }
            }
        }
    });

    observer.observe(target, { attributes: true, childList: true })
    return true

}

let set = false
window.addEventListener("load", () => {
    console.log("[asobi-mute] try to set observer...")
    setInterval(() => {
        if (target != null && document.body.contains(target)) {
            return
        }
        if (set) {
            set = false
            console.log("[asobi-mute] retry to set observer...")
        }
        set = setObserver()
    }, 1000)
})



export { }