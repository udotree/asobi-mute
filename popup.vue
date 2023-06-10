<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const input = ref("")
const userList = ref<string[]>([])

const add = () => {
    if (input.value == "") {
        return
    }

    userList.value.push(input.value)
    input.value = ""
    update()
}

const remove = (user: string) => {
    userList.value = userList.value.filter(x => x != user)
    update()
}

const update = async () => {
    console.log("update!")
    await storage.set("userList", userList.value)
}

onMounted(async () => {
    const list = await storage.get<string[]>("userList") ?? []

    if (Array.isArray(list)) {
        userList.value = list
    } else {
        console.warn("err: userList is not array!", list)
        userList.value = []
    }
})

</script>

<template>
    <div class="container">
        <h2>ASOBISTAGE コメントミュート</h2>
        <div>ミュートしたい名前を追加してください（完全一致）</div>
        <input type="text" v-model="input" @keydown.enter="add">
        <input type="button" value="追加" @click="add">
        <table id="muteList">
            <tr v-for="user in userList">
                <td>{{ user }}</td>
                <td><button type="button" @click="remove(user)">削除</button></td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
.container {
    width: 360px;
    height: 480px;
}
</style>