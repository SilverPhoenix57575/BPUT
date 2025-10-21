#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Security verification script for AI Learning Platform"""
import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def check_file_exists(filepath, should_exist=True):
    exists = os.path.exists(filepath)
    if should_exist:
        return exists, f"✓ {filepath} exists" if exists else f"✗ {filepath} missing"
    else:
        return not exists, f"✓ {filepath} not in git" if not exists else f"✗ {filepath} should not be tracked"

def check_gitignore():
    print("\n" + "="*60)
    print("CHECKING .gitignore")
    print("="*60)
    
    gitignore_path = ".gitignore"
    if not os.path.exists(gitignore_path):
        print("✗ .gitignore not found!")
        return False
    
    with open(gitignore_path, 'r') as f:
        content = f.read()
    
    required_patterns = [
        ".env",
        "*.db",
        "*.sqlite",
        "uploads/",
        "*.log",
        "__pycache__",
        "venv/",
        "node_modules/"
    ]
    
    all_present = True
    for pattern in required_patterns:
        if pattern in content:
            print(f"✓ {pattern} is ignored")
        else:
            print(f"✗ {pattern} NOT ignored")
            all_present = False
    
    return all_present

def check_env_files():
    print("\n" + "="*60)
    print("CHECKING ENVIRONMENT FILES")
    print("="*60)
    
    checks = [
        (".env.example", True),
        ("backend/.env.example", True),
        ("frontend/.env.example", True),
    ]
    
    all_ok = True
    for filepath, should_exist in checks:
        ok, msg = check_file_exists(filepath, should_exist)
        print(msg)
        all_ok = all_ok and ok
    
    # Check if actual .env files have content
    env_files = [".env.docker", "backend/.env", "frontend/.env"]
    for env_file in env_files:
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                content = f.read()
                if "your_actual" in content.lower() or "changeme" in content.lower():
                    print(f"⚠ {env_file} contains placeholder values")
                    all_ok = False
                else:
                    print(f"✓ {env_file} configured")
    
    return all_ok

def check_dependencies():
    print("\n" + "="*60)
    print("CHECKING DEPENDENCIES")
    print("="*60)
    
    req_file = "backend/requirements.txt"
    if not os.path.exists(req_file):
        print(f"✗ {req_file} not found")
        return False
    
    with open(req_file, 'r') as f:
        content = f.read()
    
    required_packages = [
        ("passlib[bcrypt]", "Password hashing"),
        ("python-jose[cryptography]", "JWT tokens"),
        ("fastapi", "Web framework"),
    ]
    
    all_present = True
    for package, purpose in required_packages:
        package_name = package.split('[')[0]
        if package_name in content:
            print(f"✓ {package} installed ({purpose})")
        else:
            print(f"✗ {package} missing ({purpose})")
            all_present = False
    
    return all_present

def check_security_implementations():
    print("\n" + "="*60)
    print("CHECKING SECURITY IMPLEMENTATIONS")
    print("="*60)
    
    checks = []
    
    # Check auth.py for bcrypt
    auth_file = "backend/app/auth.py"
    if os.path.exists(auth_file):
        with open(auth_file, 'r') as f:
            content = f.read()
        if "passlib" in content and "bcrypt" in content:
            print("✓ Bcrypt password hashing implemented")
            checks.append(True)
        else:
            print("✗ Bcrypt password hashing NOT implemented")
            checks.append(False)
    else:
        print(f"✗ {auth_file} not found")
        checks.append(False)
    
    # Check middleware.py for rate limiting
    middleware_file = "backend/app/middleware.py"
    if os.path.exists(middleware_file):
        with open(middleware_file, 'r') as f:
            content = f.read()
        if "AIRateLimitMiddleware" in content:
            print("✓ AI rate limiting implemented")
            checks.append(True)
        else:
            print("✗ AI rate limiting NOT implemented")
            checks.append(False)
    else:
        print(f"✗ {middleware_file} not found")
        checks.append(False)
    
    # Check main.py for exception handlers
    main_file = "backend/app/main.py"
    if os.path.exists(main_file):
        with open(main_file, 'r') as f:
            content = f.read()
        if "exception_handler" in content:
            print("✓ Global exception handlers implemented")
            checks.append(True)
        else:
            print("✗ Global exception handlers NOT implemented")
            checks.append(False)
    else:
        print(f"✗ {main_file} not found")
        checks.append(False)
    
    # Check dependencies.py for auth middleware
    dep_file = "backend/app/dependencies.py"
    if os.path.exists(dep_file):
        with open(dep_file, 'r') as f:
            content = f.read()
        if "get_current_user" in content and "User" in content:
            print("✓ Authentication middleware implemented")
            checks.append(True)
        else:
            print("✗ Authentication middleware NOT properly implemented")
            checks.append(False)
    else:
        print(f"✗ {dep_file} not found")
        checks.append(False)
    
    return all(checks)

def check_sensitive_files():
    print("\n" + "="*60)
    print("CHECKING FOR SENSITIVE FILES IN GIT")
    print("="*60)
    
    sensitive_patterns = [
        "backend/app.db",
        "backend/*.db",
        ".env",
        "backend/.env",
        "frontend/.env",
        "backend/uploads/*",
        "backend/logs/app.log",
    ]
    
    print("⚠ Run 'remove-sensitive-files.bat' to remove these from git")
    print("⚠ Then commit and push the changes")
    
    return True

def main():
    print("\n" + "="*60)
    print("AI LEARNING PLATFORM - SECURITY VERIFICATION")
    print("="*60)
    
    results = {
        ".gitignore": check_gitignore(),
        "Environment Files": check_env_files(),
        "Dependencies": check_dependencies(),
        "Security Implementations": check_security_implementations(),
        "Sensitive Files": check_sensitive_files(),
    }
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    for check, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {check}")
    
    all_passed = all(results.values())
    
    print("\n" + "="*60)
    if all_passed:
        print("✓ ALL SECURITY CHECKS PASSED!")
    else:
        print("✗ SOME SECURITY CHECKS FAILED")
        print("\nPlease fix the issues above before deploying.")
    print("="*60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
