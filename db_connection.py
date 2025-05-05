import mysql.connector

def get_db_connection():
    """Hàm tạo kết nối đến cơ sở dữ liệu MySQL."""
    return mysql.connector.connect(
        host="localhost",       # Địa chỉ MySQL server
        user="root",            # Tên đăng nhập MySQL
        password="root",        # Mật khẩu MySQL
        database="roomiego"     # Tên database
    )