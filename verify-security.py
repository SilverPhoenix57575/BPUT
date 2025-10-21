#!/usr/bin/env python3
"""
Security Setup Verification Script
Run this to verify your security setup is correct
"""

import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"✅ {description}: Found")
        return True
    else:
        print(f"❌ {description}: Missing")
        return False

def check_env_file(filepath, required_keys):
    """Check if .env file has required keys and they're not placeholders"""
    if not os.path.exists(filepath):
        print(f"❌ {filepath}: File not found")
        return False
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    all_good = True
    for key in required_keys:
        if key not in content:
            print(f"❌ {filepath}: Missing {key}")
            all_good = False
        elif f"{key}=your_" in content or f"{key}=generate-" in content:
            print(f"⚠️  {filepath}: {key} is still a placeholder!")
            all_good = False
        else:
            # Check if value is not empty
            for line in content.split('\n'):
                if line.startswith(f"{key}="):
                    value = line.split('=', 1)[1].strip()
                    if len(value) < 10:
                        print(f"⚠️  {filepath}: {key} seems too short")
                        all_good = False
                    else:
                        print(f"✅ {filepath}: {key} is set")
                    break
    
    return all_good

def check_database():
    """Check if database exists"""
    db_path = "backend/app.db"
    if os.path.exists(db_path):
        size = os.path.getsize(db_path)
        print(f"✅ Database exists ({size} bytes)")
        if size < 1000:
            print("⚠️  Database seems very small - might need initialization")
        return True
    else:
        print("ℹ️  Database doesn't exist yet (will be created on first run)")
        return True

def main():
    print("=" * 60)
    print("🔐 AI Learning Platform - Security Verification")
    print("=" * 60)
    print()
    
    all_checks_passed = True
    
    # Check .env files exist
    print("📁 Checking configuration files...")
    all_checks_passed &= check_file_exists(".env.docker", ".env.docker")
    all_checks_passed &= check_file_exists("backend/.env", "backend/.env")
    print()
    
    # Check .env.docker
    print("🔍 Checking .env.docker...")
    all_checks_passed &= check_env_file(".env.docker", ["GEMINI_API_KEY", "SECRET_KEY"])
    print()
    
    # Check backend/.env
    print("🔍 Checking backend/.env...")
    all_checks_passed &= check_env_file("backend/.env", ["GEMINI_API_KEY", "SECRET_KEY", "DATABASE_URL"])
    print()
    
    # Check database
    print("💾 Checking database...")
    check_database()
    print()
    
    # Check security modules
    print("🔒 Checking security modules...")
    all_checks_passed &= check_file_exists("backend/app/auth.py", "JWT Auth Module")
    all_checks_passed &= check_file_exists("backend/app/dependencies.py", "Auth Dependencies")
    print()
    
    # Final verdict
    print("=" * 60)
    if all_checks_passed:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("Your security setup looks good. You can now run:")
        print("  docker-compose --env-file .env.docker up --build")
    else:
        print("❌ SOME CHECKS FAILED!")
        print()
        print("Please fix the issues above. Read START_HERE.md for help.")
    print("=" * 60)
    
    return 0 if all_checks_passed else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nVerification cancelled.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
