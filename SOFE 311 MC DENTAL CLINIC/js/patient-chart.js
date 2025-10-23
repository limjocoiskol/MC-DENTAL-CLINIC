// Patient Chart System
function initializePatientChart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        if (!users[userIndex].patientChart) {
            users[userIndex].patientChart = {
                services: [],
                images: []
            };
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Add Treatment Record
function addTreatmentRecord(treatmentData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        if (!users[userIndex].patientChart.services) {
            users[userIndex].patientChart.services = [];
        }
        
        users[userIndex].patientChart.services.push({
            ...treatmentData,
            date: new Date().toISOString()
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Add Image to Patient Chart
function addImageToChart(imageData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        if (!users[userIndex].patientChart.images) {
            users[userIndex].patientChart.images = [];
        }
        
        users[userIndex].patientChart.images.push({
            ...imageData,
            date: new Date().toISOString()
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Handle Image Upload
function handleImageUpload(file, description) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = {
                url: e.target.result,
                description: description,
                type: file.type,
                size: file.size
            };
            
            if (addImageToChart(imageData)) {
                resolve(imageData);
            } else {
                reject(new Error('Failed to save image to patient chart'));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read image file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Get Patient Chart
function getPatientChart(patientEmail) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === patientEmail);
    
    if (user && user.patientChart) {
        return user.patientChart;
    }
    return null;
}

// Update Treatment Record
function updateTreatmentRecord(recordIndex, updatedData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1 && users[userIndex].patientChart.services[recordIndex]) {
        users[userIndex].patientChart.services[recordIndex] = {
            ...users[userIndex].patientChart.services[recordIndex],
            ...updatedData
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Delete Treatment Record
function deleteTreatmentRecord(recordIndex) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1 && users[userIndex].patientChart.services[recordIndex]) {
        users[userIndex].patientChart.services.splice(recordIndex, 1);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Delete Image from Chart
function deleteImageFromChart(imageIndex) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1 && users[userIndex].patientChart.images[imageIndex]) {
        users[userIndex].patientChart.images.splice(imageIndex, 1);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Update Image Description
function updateImageDescription(imageIndex, newDescription) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1 && users[userIndex].patientChart.images[imageIndex]) {
        users[userIndex].patientChart.images[imageIndex].description = newDescription;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Export functions
export {
    initializePatientChart,
    addTreatmentRecord,
    addImageToChart,
    handleImageUpload,
    getPatientChart,
    updateTreatmentRecord,
    deleteTreatmentRecord,
    deleteImageFromChart,
    updateImageDescription
};

