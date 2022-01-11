<template>
  <el-upload
    class="upload-demo"
    action="https://jsonplaceholder.typicode.com/posts/"
    :before-remove="beforeRemove"
    :limit="1"
    :on-change="handleChange"
  >
    <el-button type="primary">Click to upload</el-button>
  </el-upload>
</template>

<script>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import axios from "axios";
const SIZE = 10 * 1024 * 1024; // 切片大小,这里设置 10MB，也就是说 100 MB 的文件会被分成 10 个切片
export default {
  components: {},
  setup() {
    const fileData = ref(null);
    const data = ref([]);
    const beforeRemove = (file) => {
      return ElMessageBox.confirm(`Cancel the transfert of ${file.name} ?`);
    };
    const handleChange = (file) => {
      if (!file) {
        return;
      }
      fileData.value = file;
      const fileChunkList = createFileChunk(file.raw);
      data.value = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        hash: `${fileData.value.name}-${index}`,
      }));
      uploadChunks();
    };
    const createFileChunk = (file, size = SIZE) => {
      const fileChunk = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunk.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      console.log(fileChunk);
      return fileChunk;
    };
    const uploadChunks = async () => {
      const requestList = data.value.map(async ({ chunk, hash }) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("filename", fileData.value.name);
        await axios
          .post("http://localhost:3000/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res);
          });
      });
      await Promise.all(requestList);
      // 通知后端合并切片
      mergeRequest();
    };
    const mergeRequest = () => {
      axios.post("http://localhost:3000/merge").then((res) => {
        console.log(res);
      });
    };
    return {
      fileData,
      data,
      beforeRemove,
      handleChange,
      createFileChunk,
      uploadChunks,
      mergeRequest,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
