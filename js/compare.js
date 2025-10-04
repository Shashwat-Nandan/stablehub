// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const stablecoinCards = document.querySelectorAll('.stablecoin-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterType = button.getAttribute('data-type');

        // Filter cards
        stablecoinCards.forEach(card => {
            if (filterType === 'all') {
                card.style.display = 'block';
            } else {
                const cardType = card.getAttribute('data-type');
                card.style.display = cardType === filterType ? 'block' : 'none';
            }
        });
    });
});

// View toggle functionality
const gridViewBtn = document.getElementById('grid-view');
const tableViewBtn = document.getElementById('table-view');
const gridContainer = document.getElementById('grid-container');
const tableContainer = document.getElementById('table-container');

gridViewBtn.addEventListener('click', () => {
    gridViewBtn.classList.add('active');
    tableViewBtn.classList.remove('active');
    gridContainer.style.display = 'grid';
    tableContainer.style.display = 'none';
});

tableViewBtn.addEventListener('click', () => {
    tableViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    gridContainer.style.display = 'none';
    tableContainer.style.display = 'block';
});
