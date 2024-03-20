
document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.getElementById('likeButton');

    likeButton.addEventListener('click', function() {
        const isLiked = likeButton.classList.toggle('liked');
        likeButton.textContent = isLiked ? 'Liked' : 'Like'; // Toggle button text
    });
});s