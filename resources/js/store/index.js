import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        comments: [],
        currentPage: 1,
        perPage: 3,
        sortBy: 'id',
        sortDirection: 'asc',
        loading: false,
        error: null,
    },

    mutations: {
        SET_COMMENTS(state, comments) {
            state.comments = comments;
        },
        ADD_COMMENT(state, comment) {
            state.comments.push(comment);
        },
        DELETE_COMMENT(state, id) {
            state.comments = state.comments.filter(c => c.id !== id);

            // Если текущая страница стала пустой — переходим на предыдущую
            const totalPages = Math.ceil(state.comments.length / state.perPage);
            if (state.currentPage > totalPages && totalPages > 0) {
                state.currentPage = totalPages;
            }
            // Если комментариев вообще не осталось — на первую
            if (state.comments.length === 0) {
                state.currentPage = 1;
            }
        },
        SET_PAGE(state, page) {
            state.currentPage = page;
        },
        SET_SORT(state, { sortBy, sortDirection }) {
            state.sortBy = sortBy;
            state.sortDirection = sortDirection;
        },
        SET_LOADING(state, value) {
            state.loading = value;
        },
        SET_ERROR(state, message) {
            state.error = message;
        },
    },

    actions: {
        async fetchComments({ commit }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const response = await axios.get('/api/comments');
                const comments = response.data.data || response.data;
                commit('SET_COMMENTS', comments);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
                commit('SET_ERROR', 'Не удалось загрузить комментарии');
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async addComment({ commit }, commentData) {
            try {
                const response = await axios.post('/api/comments', commentData);
                const newComment = response.data.data || response.data;
                commit('ADD_COMMENT', newComment);
            } catch (error) {
                console.error('Ошибка добавления:', error);
                commit('SET_ERROR', 'Не удалось добавить комментарий');
                throw error;
            }
        },

        async deleteComment({ commit }, id) {
            try {
                await axios.delete(`/api/comments/${id}`);
                commit('DELETE_COMMENT', id);
            } catch (error) {
                console.error('Ошибка удаления:', error);
                commit('SET_ERROR', 'Не удалось удалить комментарий');
                throw error;
            }
        },
    },

    getters: {
        sortedComments(state) {
            const sorted = [...state.comments].sort((a, b) => {
                let result;
                if (state.sortBy === 'id') {
                    result = a.id - b.id;
                } else {
                    result = new Date(a.date) - new Date(b.date);
                }
                return state.sortDirection === 'asc' ? result : -result;
            });
            return sorted;
        },

        paginatedComments(state, getters) {
            const start = (state.currentPage - 1) * state.perPage;
            const end = start + state.perPage;
            return getters.sortedComments.slice(start, end);
        },

        totalPages(state) {
            return Math.ceil(state.comments.length / state.perPage);
        },
    },
});