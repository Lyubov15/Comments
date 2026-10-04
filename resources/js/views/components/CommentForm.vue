<template>
    <div class="comment-form">
        <h2>Добавить комментарий</h2>

        <form @submit.prevent="onSubmit" novalidate>
            <div class="form-row">
                <label>
                    Имя <span class="required">*</span>
                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Ваше имя"
                        maxlength="50"
                        :class="{ 'input-error': errors.name }"
                        @blur="validateName"
                    />
                    <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                </label>
            </div>

            <div class="form-row">
                <label>
                    Дата <span class="required">*</span>
                    <DatePicker
                        v-model="form.date"
                        format="DD.MM.YYYY"
                        value-type="format"
                        :editable="false"
                        :clearable="false"
                        placeholder="Выберите дату"
                        :disabled-date="disabledDate"
                        :class="{ 'input-error': errors.date }"
                        @input="validateDate"
                    />
                    <span v-if="errors.date" class="error-text">{{ errors.date }}</span>
                </label>
            </div>

            <div class="form-row">
                <label>
                    Текст комментария <span class="required">*</span>
                    <textarea
                        v-model="form.text"
                        placeholder="Введите текст..."
                        rows="4"
                        maxlength="1000"
                        :class="{ 'input-error': errors.text }"
                        @blur="validateText"
                    ></textarea>
                    <span v-if="errors.text" class="error-text">{{ errors.text }}</span>
                </label>
            </div>

            <button
                type="submit"
                class="submit-btn"
                :disabled="submitting"
            >
                {{ submitting ? 'Отправка...' : 'Добавить комментарий' }}
            </button>
        </form>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
    name: 'CommentForm',

    components: {
        DatePicker
    },

    data() {
        return {
            form: {
                name: '',
                text: '',
                date: ''
            },
            submitting: false,
            errors: {
                name: '',
                text: '',
                date: ''
            }
        };
    },

    methods: {
        // Проверка имени: только буквы, пробелы и дефисы, минимум 2 символа
        validateName() {
            const value = this.form.name.trim();

            if (!value) {
                this.errors.name = 'Введите имя';
                return false;
            }

            const nameRegex = /^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\s\-]*$/;

            if (!nameRegex.test(value)) {
                this.errors.name = 'Имя может содержать только буквы, пробел и дефис';
                return false;
            }

            if (value.length < 2) {
                this.errors.name = 'Имя должно быть не короче 2 символов';
                return false;
            }

            this.errors.name = '';
            return true;
        },

        validateText() {
            const value = this.form.text.trim();

            if (!value) {
                this.errors.text = 'Введите текст комментария';
                return false;
            }

            if (value.length < 3) {
                this.errors.text = 'Комментарий слишком короткий (минимум 3 символа)';
                return false;
            }

            this.errors.text = '';
            return true;
        },

        validateDate() {
            if (!this.form.date) {
                this.errors.date = 'Выберите дату';
                return false;
            }
            this.errors.date = '';
            return true;
        },

        // Проверяет все поля сразу
        validateAll() {
            const nameOk = this.validateName();
            const textOk = this.validateText();
            const dateOk = this.validateDate();
            return nameOk && textOk && dateOk;
        },

        // Преобразует 'DD.MM.YYYY' → 'YYYY-MM-DD' для сервера
        toServerDate(dateStr) {
            if (!dateStr) return '';
            const [day, month, year] = dateStr.split('.');
            return `${year}-${month}-${day}`;
        },

        disabledDate(date) {
            return date > new Date();
        },

        async onSubmit() {
            if (!this.validateAll()) {
                return;
            }

            this.submitting = true;

            try {
                await this.$store.dispatch('addComment', {
                    name: this.form.name.trim(),
                    text: this.form.text.trim(),
                    date: this.toServerDate(this.form.date)
                });

                this.form.name = '';
                this.form.text = '';
                this.form.date = '';
                this.errors = { name: '', text: '', date: '' };

                this.$store.commit('SET_PAGE', 1);
            } catch (error) {
                alert('Не удалось добавить комментарий. Попробуйте ещё раз.');
            } finally {
                this.submitting = false;
            }
        }
    }
};
</script>

<style scoped>
.comment-form {
    max-width: 800px;
    margin: 40px auto 0;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #f9f9f9;
}

.comment-form h2 {
    margin: 0 0 20px;
    font-size: 20px;
    color: #2c3e50;
}

.form-row {
    margin-bottom: 16px;
}

.form-row label {
    display: block;
    font-size: 14px;
    color: #555;
    font-weight: 500;
}

.form-row input[type="text"],
.form-row textarea {
    width: 100%;
    margin-top: 6px;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.form-row input[type="text"]:focus,
.form-row textarea:focus {
    outline: none;
    border-color: #42b983;
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.form-row textarea {
    resize: vertical;
    min-height: 80px;
}

.required {
    color: #ff4d4f;
}

.input-error {
    border-color: #ff4d4f !important;
    background: #fff5f5;
}

.error-text {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: #ff4d4f;
}

.comment-form ::v-deep .mx-datepicker {
    width: 100%;
    margin-top: 6px;
}

.comment-form ::v-deep .mx-input {
    padding: 10px 12px;
    height: auto;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.comment-form ::v-deep .input-error .mx-input {
    border-color: #ff4d4f !important;
    background: #fff5f5;
}

.submit-btn {
    background: #42b983;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
    background: #369870;
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 600px) {
    .comment-form {
        padding: 16px;
    }
}
</style>