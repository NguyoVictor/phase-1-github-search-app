document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form'); // Changed to 'github-form'
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('user-list'); // Changed to 'user-list'
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm === '') return;
  
      searchUsers(searchTerm)
        .then(users => {
          displayUsers(users);
        })
        .catch(error => {
          console.error('Error searching users:', error);
          displayError('An error occurred while searching for users. Please try again later.');
        });
    });
  
    function searchUsers(username) {
      const url = `https://api.github.com/search/users?q=${username}`;
      return fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => data.items) // array of user objects
    }
  
    function displayUsers(users) {
      searchResults.innerHTML = '';
      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
          <h3>${user.login}</h3>
          <img src="${user.avatar_url}" alt="${user.login}" style="width: 100px;">
          <a href="${user.html_url}" target="_blank">Profile</a>
        `;
        userDiv.addEventListener('click', () => {
          getUserRepos(user.login)
            .then(repos => {
              displayRepos(repos);
            })
            .catch(error => {
              console.error('Error fetching user repos:', error);
              displayError('An error occurred while fetching user repositories. Please try again later.');
            });
        });
        searchResults.appendChild(userDiv);
      });
    }
  
    function getUserRepos(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      return fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
    }
  
    function displayRepos(repos) {
      const reposList = document.getElementById('repos-list'); // Selecting 'repos-list'
      reposList.innerHTML = ''; // Clearing previous repos
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.textContent = repo.full_name;
        reposList.appendChild(repoItem);
      });
    }
  
    function displayError(message) {
      const errorDiv = document.createElement('div');
      errorDiv.classList.add('error-message');
      errorDiv.textContent = message;
      searchResults.appendChild(errorDiv);
    }
});
