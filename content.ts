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
})()


export const config: PlasmoCSConfig = {
    matches: ["https://asobistage.asobistore.jp/*"],
    all_frames: true
}

let id: NodeJS.Timer = null
const setObserver = () => {

    let target = document.querySelector("div[class^='commentViewer_commentList__'] > div:nth-child(2) > div > div")
    if (!target) {
        target = document.querySelector("*[data-test-id='virtuoso-item-list']")
    }
    if (!target) {
        return
    }

    console.log("[asobi-mute] start comment watching!")
    clearInterval(id)

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

}



window.addEventListener("load", () => {
    id = setInterval(setObserver, 1000);
})

export { }