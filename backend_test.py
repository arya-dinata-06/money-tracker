import requests
import sys
import json
from datetime import datetime

class MoneyTrackerAPITester:
    def __init__(self, base_url="https://expense-buddy-366.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.created_transaction_id = None
        self.created_category_id = None
        self.created_user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_login(self, username="superadmin", password="admin123"):
        """Test login and get token"""
        success, response = self.run_test(
            "Login",
            "POST",
            "auth/login",
            200,
            data={"username": username, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   Token obtained: {self.token[:20]}...")
            print(f"   User ID: {self.user_id}")
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user info"""
        return self.run_test("Get Current User", "GET", "users/me", 200)

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test("Get Categories", "GET", "categories", 200)
        if success:
            print(f"   Found {len(response)} categories")
        return success

    def test_create_custom_category(self):
        """Test creating a custom category"""
        success, response = self.run_test(
            "Create Custom Category",
            "POST",
            "categories",
            200,
            data={"name": "Test Category", "type": "expense"}
        )
        if success and 'id' in response:
            self.created_category_id = response['id']
            print(f"   Created category ID: {self.created_category_id}")
        return success

    def test_get_transactions(self):
        """Test getting transactions"""
        success, response = self.run_test("Get Transactions", "GET", "transactions", 200)
        if success:
            print(f"   Found {len(response)} transactions")
        return success

    def test_get_transaction_stats(self):
        """Test getting transaction statistics"""
        success, response = self.run_test("Get Transaction Stats", "GET", "transactions/stats", 200)
        if success:
            print(f"   Total Income: {response.get('total_income', 0)}")
            print(f"   Total Expense: {response.get('total_expense', 0)}")
            print(f"   Balance: {response.get('balance', 0)}")
            print(f"   Transaction Count: {response.get('transaction_count', 0)}")
        return success

    def test_create_transaction(self):
        """Test creating a transaction"""
        # First get a category to use
        success, categories = self.run_test("Get Categories for Transaction", "GET", "categories", 200)
        if not success or not categories:
            print("❌ Cannot create transaction - no categories available")
            return False
        
        expense_category = next((cat for cat in categories if cat['type'] == 'expense'), None)
        if not expense_category:
            print("❌ Cannot create transaction - no expense category available")
            return False

        success, response = self.run_test(
            "Create Transaction",
            "POST",
            "transactions",
            200,
            data={
                "type": "expense",
                "category_id": expense_category['id'],
                "amount": 25000,
                "description": "Test transaction",
                "date": "2024-01-15"
            }
        )
        if success and 'id' in response:
            self.created_transaction_id = response['id']
            print(f"   Created transaction ID: {self.created_transaction_id}")
        return success

    def test_update_transaction(self):
        """Test updating a transaction"""
        if not self.created_transaction_id:
            print("❌ Cannot update transaction - no transaction created")
            return False

        return self.run_test(
            "Update Transaction",
            "PUT",
            f"transactions/{self.created_transaction_id}",
            200,
            data={"amount": 30000, "description": "Updated test transaction"}
        )

    def test_delete_transaction(self):
        """Test deleting a transaction"""
        if not self.created_transaction_id:
            print("❌ Cannot delete transaction - no transaction created")
            return False

        return self.run_test(
            "Delete Transaction",
            "DELETE",
            f"transactions/{self.created_transaction_id}",
            200
        )

    def test_get_all_users(self):
        """Test getting all users (superadmin only)"""
        success, response = self.run_test("Get All Users", "GET", "users", 200)
        if success:
            print(f"   Found {len(response)} users")
        return success

    def test_create_user(self):
        """Test creating a new user (superadmin only)"""
        test_username = f"testuser_{datetime.now().strftime('%H%M%S')}"
        success, response = self.run_test(
            "Create User",
            "POST",
            "auth/register",
            200,
            data={
                "username": test_username,
                "password": "testpass123",
                "role": "user"
            }
        )
        if success and 'user' in response:
            self.created_user_id = response['user']['id']
            print(f"   Created user: {test_username}")
        return success

    def test_download_source_code(self):
        """Test downloading source code"""
        url = f"{self.base_url}/download/source-code"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        print(f"\n🔍 Testing Download Source Code...")
        print(f"   URL: {url}")
        
        try:
            response = requests.get(url, headers=headers)
            success = response.status_code == 200
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                print(f"   Content-Type: {response.headers.get('content-type', 'N/A')}")
                print(f"   Content-Length: {len(response.content)} bytes")
            else:
                print(f"❌ Failed - Status: {response.status_code}")
                print(f"   Error: {response.text}")
            
            self.tests_run += 1
            return success
            
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.tests_run += 1
            return False

def main():
    print("🚀 Starting Money Tracker API Tests")
    print("=" * 50)
    
    tester = MoneyTrackerAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("Login", tester.test_login),
        ("Get Current User", tester.test_get_current_user),
        ("Get Categories", tester.test_get_categories),
        ("Create Custom Category", tester.test_create_custom_category),
        ("Get Transactions", tester.test_get_transactions),
        ("Get Transaction Stats", tester.test_get_transaction_stats),
        ("Create Transaction", tester.test_create_transaction),
        ("Update Transaction", tester.test_update_transaction),
        ("Delete Transaction", tester.test_delete_transaction),
        ("Get All Users", tester.test_get_all_users),
        ("Create User", tester.test_create_user),
        ("Download Source Code", tester.test_download_source_code),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            if not success:
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print(f"\n✅ All tests passed!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())