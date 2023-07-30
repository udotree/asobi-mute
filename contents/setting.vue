<script setup lang="ts">
import {onMounted, ref} from "vue"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()
const showWindow = ref(false)
const name = ref("")
const muteList  =ref<string[]>([])
const add = () => {
    if(name.value == "") return

    muteList.value.push(name.value)
    name.value = ""
    send()
}
const del = (name: string) => {
    muteList.value = muteList.value.filter(x => x != name)
    send()
}
const send = async () => {
    await storage.set("userList", muteList.value)
}

onMounted(async () => {
    let userList = await storage.get<string[]>("userList") ?? []
    if (!Array.isArray(userList)) userList = []
    muteList.value = userList
})
</script>

<script lang="ts">
import type { PlasmoGetInlineAnchor } from 'plasmo';

const getInlineAnchor: PlasmoGetInlineAnchor = () => {
    const e1 =  document.querySelector("div[class^='player_comment_input_'] > div")
    if(e1) return e1

    return document.querySelector("div[class^='style_menu_'] > nav")!
}
export default { 
    plasmo: {
        getInlineAnchor
    }
}
</script>


<template>
    <div class="container">
        <div class="icon" @click="showWindow = !showWindow" :class="{active: showWindow}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28">
                <path d="M16.5 4.814c0-1.094-1.307-1.66-2.105-.912l-4.937 4.63a1.75 1.75 0 0 1-1.197.473H5.25A3.25 3.25 0 0 0 2 12.255v3.492a3.25 3.25 0 0 0 3.25 3.25h3.012c.444 0 .872.17 1.196.473l4.937 4.626c.799.748 2.105.182 2.105-.912V4.814Zm3.282 5.907a.75.75 0 0 0-1.064 1.057l2.218 2.235l-2.215 2.205a.75.75 0 0 0 1.058 1.063l2.218-2.208l2.225 2.209a.75.75 0 1 0 1.056-1.064l-2.22-2.205l2.224-2.234a.75.75 0 0 0-1.063-1.059l-2.223 2.232l-2.214-2.23Z"></path>
            </svg>
        </div>
        <div class="window" v-show="showWindow">
            <h3>asobi-mute 設定</h3>
            <input type="text" v-model="name" placeholder="名前を入力">
            <button @click="add" type="button">追加</button>
            <div class="muteList">
                <div v-for="mute in muteList">
                {{ mute }}
                <button type="button" @click="del(mute)">削除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
plasmo-csui{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    pointer-events: none;
}

plasmo-csui *{
    box-sizing: border-box;
}
</style>
<style scoped>
*{
    box-sizing: border-box;
}

.container{
    position: relative;
    width: 100%;
    color: #ccc;
}

.icon{
    border-radius: 50%;
    margin: 0.25em;
    width: calc(24px * 1.42);
    height: calc(24px * 1.42);
    border: #666 solid 1px;
    display:inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 80%;
    color: #aaa;
    cursor: pointer;
    pointer-events: auto;

}
svg{
    width: 24px;
    height:24px;
}
svg path{
    fill: #aaa;
}

.icon.active,
.icon:hover{
    background-color: #666;
}

.window{
    width: 100%;
    height: 300px;
    background-color: rgba(17,18,17,0.85);
    padding: 0.5em;
    border-radius: 0.5em 0.5em 0 0;
    position: absolute;
    bottom: 100%;
    overflow-y: auto;
    pointer-events: auto;

}

button{
    background-color: #333433;
    color: inherit;
    border: 1px solid #666;
    border-radius: 3px;
}

h3{
    margin: 0.4em 0
}
</style>