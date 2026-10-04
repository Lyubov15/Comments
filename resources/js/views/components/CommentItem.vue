<template>
    <div class="comment-item">
        <div class="comment-header">
            <strong class="comment-name">{{ comment.name }}</strong>
            <span class="comment-date">{{ formatDate(comment.date) }}</span>
        </div>
        <p class="comment-text">{{ comment.text }}</p>
        <button class="comment-delete" @click="onDelete">
            Удалить
        </button>
    </div>
</template>

<script>
export default {
    name: 'CommentItem',

    // props — данные, которые приходят от родителя (CommentList)
    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    methods: {
        // Форматирует дату в читаемый вид
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },

        // Обработчик клика по кнопке удаления
        onDelete() {
            // Спрашиваем подтверждение, чтобы случайно не удалить
            if (confirm('Удалить этот комментарий?')) {
                // Сообщаем родителю, что надо удалить — через $emit
                this.$emit('delete', this.comment.id);
            }
        }
    }
};
</script>

<style scoped>
/* scoped — стили применятся только к этому компоненту */
.comment-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    background: #fff;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 8px;
}

.comment-name {
    font-size: 16px;
    color: #000
}

.comment-date {
    font-size: 13px;
    color: #999;
}

.comment-text {
    margin: 0 0 12px;
    color: #000;
    line-height: 1.5;
    word-break: break-word;
}

.comment-delete {
    background: #ff4d4f;
    color: #fff;
    border: none;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.comment-delete:hover {
    background: #d9363e;
}
</style>