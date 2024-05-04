import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabaseUrl = 'https://ksebigkerxwbktkugqdl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZWJpZ2tlcnh3Ymt0a3VncWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMTI3MTksImV4cCI6MjAyOTc4ODcxOX0.nfxSiHwATmFPHt0wqKrim2dLfcSxYh_jRu6Wcf8gefE'
const supabase = createClient(supabaseUrl, supabaseKey)



// Function to accept user request
async function acceptUserRequest(name, udid, requestElement) {
  try {
    // Add user to the "users" table
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, udid }]);

    if (error) {
      throw error;
    }

    // Change button appearance to "Accepted"
    const buttons = requestElement.querySelectorAll('button');
    buttons.forEach(button => {
      button.textContent = 'Accepted';
      button.classList.remove('btn-success');
      button.classList.add('btn-secondary');
    });
  } catch (error) {
    console.error('Error accepting user request:', error.message);
  }
}

// Function to reject user request
function rejectUserRequest(requestElement) {
  // Change button appearance to "Rejected"
  const buttons = requestElement.querySelectorAll('button');
  buttons.forEach(button => {
    button.textContent = 'Rejected';
    button.classList.remove('btn-danger');
    button.classList.add('btn-secondary');
  });
}

// Fetch user requests
async function fetchUserRequests() {
  try {
    // Fetch user requests from Supabase
    const { data, error } = await supabase
      .from('user_requests')
      .select('name, udid');

    if (error) {
      throw error;
    }

    // Display user requests
    const userRequestsContainer = document.getElementById('userRequests');
    userRequestsContainer.innerHTML = ''; // Clear previous content

    data.forEach(request => {
      const requestElement = document.createElement('div');
      requestElement.classList.add('card', 'mb-3');
      requestElement.innerHTML = `
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-3">User: ${request.name}</h5>
          <p class="card-text mb-3">UDID: ${request.udid}</p>
          <div class="mt-auto">
            <button type="button" class="btn btn-success mr-2" onclick="acceptUserRequest('${request.name}', '${request.udid}', this.parentNode.parentNode)">Accept</button>
            <button type="button" class="btn btn-danger" onclick="rejectUserRequest(this.parentNode.parentNode)">Reject</button>
          </div>
        </div>
      `;
      userRequestsContainer.appendChild(requestElement);
    });
  } catch (error) {
    console.error('Error fetching user requests:', error.message);
  }
}

// Fetch user requests when the page loads
window.onload = fetchUserRequests;