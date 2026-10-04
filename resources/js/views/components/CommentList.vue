<template>
    <div class="comment-list">
        <!-- Заголовок и переключатели сортировки -->
        <div class="controls">
            <h2>
                Комментарии
                <span class="count" v-if="comments.length">({{ comments.length }})</span>
            </h2>

            <div class="sort-controls">
                <label>
                    Сортировать по:
                    <select :value="sortBy" @change="onSortByChange">
                        <option value="id">ID</option>
                        <option value="date">Дате</option>
                    </select>
                </label>

                <label>
                    Направление:
                    <select :value="sortDirection" @change="onSortDirectionChange">
                        <option value="asc">По возрастанию</option>
                        <option value="desc">По убыванию</option>
                    </select>
                </label>
            </div>
        </div>

        <!-- Состояние загрузки -->
        <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Загрузка комментариев...</p>
</div>

        <!-- Сообщение об ошибке -->
        <div v-else-if="error" class="state-message error">
            {{ error }}
        </div>

        <!-- Список пуст -->
        <div v-else-if="paginatedComments.length === 0" class="state-message">
            Пока нет комментариев. Будьте первым!
        </div>

        <!-- Список комментариев -->
        <div v-else>
            <CommentItem
                v-for="comment in paginatedComments"
                :key="comment.id"
                :comment="comment"
                @delete="onDeleteComment"
            />
        </div>

        <!-- Пагинация -->
        <div v-if="totalPages > 1" class="pagination">
            <button
                v-for="page in totalPages"
                :key="page"
                :class="{ active: page === currentPage }"
                @click="onPageChange(page)"
            >
                {{ page }}
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import CommentItem from './CommentItem.vue';

export default {
    name: 'CommentList',

    components: {
        CommentItem
    },

    computed: {
        // Автоматически подтягиваем из store нужные данные
        ...mapState([
            'currentPage',
            'sortBy',
            'sortDirection',
            'loading',
            'error',
            'comments'
        ]),

        // И вычисляемые getters
        ...mapGetters([
            'paginatedComments',
            'totalPages'
        ])
    },

    methods: {
        // mapActions подключает методы из store как локальные
        ...mapActions([
            'fetchComments',
            'deleteComment'
        ]),

        onDeleteComment(id) {
            this.deleteComment(id);
        },

        onPageChange(page) {
            this.$store.commit('SET_PAGE', page);
        },

        onSortByChange(event) {
            this.$store.commit('SET_SORT', {
                sortBy: event.target.value,
                sortDirection: this.sortDirection
            });
            // Возвращаемся на первую страницу после смены сортировки
            this.$store.commit('SET_PAGE', 1);
        },

        onSortDirectionChange(event) {
            this.$store.commit('SET_SORT', {
                sortBy: this.sortBy,
                sortDirection: event.target.value
            });
            this.$store.commit('SET_PAGE', 1);
        }
    },

    // created — вызывается при создании компонента
    created() {
        // Загружаем комментарии с сервера
        this.fetchComments();
    }
};
</script>

<style scoped>
.comment-list {
    max-width: 800px;
    margin: 0 auto;
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
}

.controls h2 {
    margin: 0;
    font-size: 24px;
    color: #2c3e50;
}

.sort-controls {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.sort-controls label {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    color: #666;
    gap: 4px;
}

.sort-controls select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background: #fff;
    cursor: pointer;
}

.state-message {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 15px;
}

.state-message.error {
    color: #ff4d4f;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.pagination button {
    min-width: 36px;
    height: 36px;
    padding: 0 10px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: all 0.2s;
}

.pagination button:hover {
    border-color: #42b983;
    color: #42b983;
}

.pagination button.active {
    background: #42b983;
    color: #fff;
    border-color: #42b983;
}

/* Адаптивность: на мобильных уменьшаем отступы */
@media (max-width: 600px) {
    .controls {
        flex-direction: column;
        align-items: flex-start;
    }

    .sort-controls {
        width: 100%;
    }

    .sort-controls label {
        flex: 1;
    }

    .sort-controls select {
        width: 100%;
    }
}

.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 12px;
    border: 4px solid #e0e0e0;
    border-top-color: #42b983;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

    .count {
        font-size: 16px;
        color: #999;
        font-weight: normal;
    }
</style>