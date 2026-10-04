<template>
    <div class="app">
        <CommentList />
        <CommentForm />
    </div>
</template>

<script>
import CommentList from './components/CommentList.vue';
import CommentForm from './components/CommentForm.vue';

export default {
    name: 'App',
    components: {
        CommentList,
        CommentForm
    }
};
</script>

<style scoped>
.app {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

@media (max-width: 600px) {
    .app {
        padding: 12px;
    }
}
</style>