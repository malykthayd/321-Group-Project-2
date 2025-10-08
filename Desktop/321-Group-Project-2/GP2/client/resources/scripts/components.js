// Reusable UI components
class Components {
    static createLoadingSpinner() {
        return `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }

    static createErrorMessage(message) {
        return `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    static createEmptyState(title, message, actionText = null, actionCallback = null) {
        const actionButton = actionText && actionCallback 
            ? `<button class="btn" onclick="${actionCallback}">${actionText}</button>`
            : '';

        return `
            <div class="empty-state">
                <h3>${title}</h3>
                <p>${message}</p>
                ${actionButton}
            </div>
        `;
    }

    static createModal(title, content, buttons = []) {
        const modalId = 'modal-' + Math.random().toString(36).substr(2, 9);
        
        const buttonHtml = buttons.map(btn => 
            `<button class="btn ${btn.class || ''}" data-action="${btn.action}">${btn.text}</button>`
        ).join('');

        return `
            <div id="${modalId}" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <span class="close" data-modal="${modalId}">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${buttonHtml}
                    </div>
                </div>
            </div>
        `;
    }

    static showModal(modalHtml) {
        // Remove existing modals
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Setup modal event listeners
        Components.setupModalListeners();
    }

    static setupModalListeners() {
        // Close button
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                document.getElementById(modalId).remove();
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => modal.remove());
            }
        });
    }

    static createForm(formData) {
        let formHtml = `<form class="custom-form">`;
        
        formData.fields.forEach(field => {
            switch (field.type) {
                case 'text':
                case 'email':
                case 'password':
                    formHtml += `
                        <div class="form-group">
                            <label for="${field.name}">${field.label}</label>
                            <input type="${field.type}" id="${field.name}" name="${field.name}" 
                                   value="${field.value || ''}" ${field.required ? 'required' : ''}>
                        </div>
                    `;
                    break;
                case 'textarea':
                    formHtml += `
                        <div class="form-group">
                            <label for="${field.name}">${field.label}</label>
                            <textarea id="${field.name}" name="${field.name}" 
                                      ${field.required ? 'required' : ''}>${field.value || ''}</textarea>
                        </div>
                    `;
                    break;
                case 'select':
                    const options = field.options.map(opt => 
                        `<option value="${opt.value}" ${opt.selected ? 'selected' : ''}>${opt.text}</option>`
                    ).join('');
                    formHtml += `
                        <div class="form-group">
                            <label for="${field.name}">${field.label}</label>
                            <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                                ${options}
                            </select>
                        </div>
                    `;
                    break;
            }
        });

        formHtml += `
            <div class="form-actions">
                <button type="submit" class="btn">${formData.submitText || 'Submit'}</button>
                ${formData.cancelText ? `<button type="button" class="btn btn-secondary">${formData.cancelText}</button>` : ''}
            </div>
        </form>`;

        return formHtml;
    }

    static showToast(message, type = 'info', duration = 3000) {
        const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
        const toastHtml = `
            <div id="${toastId}" class="toast toast-${type}">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="document.getElementById('${toastId}').remove()">&times;</button>
            </div>
        `;

        // Add toast to container
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);

        // Auto remove after duration
        setTimeout(() => {
            const toast = document.getElementById(toastId);
            if (toast) {
                toast.remove();
            }
        }, duration);
    }
}

// Add CSS for components
const componentStyles = `
<style>
.loading-spinner {
    text-align: center;
    padding: 2rem;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-message {
    background: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 5px;
    border-left: 4px solid #c62828;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #666;
}

.empty-state h3 {
    margin-bottom: 1rem;
    color: #333;
}

.modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
}

.close {
    font-size: 2rem;
    cursor: pointer;
    color: #999;
}

.close:hover {
    color: #333;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #eee;
    text-align: right;
}

.modal-footer .btn {
    margin-left: 0.5rem;
}

.custom-form {
    max-width: 400px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-actions {
    margin-top: 1.5rem;
    text-align: right;
}

.btn-secondary {
    background: #6c757d;
    margin-right: 0.5rem;
}

.btn-secondary:hover {
    background: #5a6268;
}

.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2000;
}

.toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    padding: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 5px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    min-width: 300px;
    animation: slideIn 0.3s ease;
}

.toast-info {
    border-left: 4px solid #17a2b8;
}

.toast-success {
    border-left: 4px solid #28a745;
}

.toast-warning {
    border-left: 4px solid #ffc107;
}

.toast-error {
    border-left: 4px solid #dc3545;
}

.toast-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    margin-left: 1rem;
}

.toast-close:hover {
    color: #333;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .toast-container {
        left: 10px;
        right: 10px;
        top: 10px;
    }
    
    .toast {
        min-width: auto;
    }
}
</style>
`;

// Add styles to document head
document.head.insertAdjacentHTML('beforeend', componentStyles);
