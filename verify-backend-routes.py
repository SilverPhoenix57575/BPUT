"""
Quick script to verify backend routes are registered correctly
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from app.main import app
    
    print("=" * 60)
    print("BACKEND ROUTES VERIFICATION")
    print("=" * 60)
    
    routes = []
    for route in app.routes:
        if hasattr(route, 'path') and hasattr(route, 'methods'):
            routes.append({
                'path': route.path,
                'methods': list(route.methods) if route.methods else [],
                'name': route.name
            })
    
    # Filter AI routes
    ai_routes = [r for r in routes if '/ai/' in r['path']]
    
    print("\n✓ AI Routes Found:")
    print("-" * 60)
    for route in ai_routes:
        methods = ', '.join(route['methods'])
        print(f"  {methods:15} {route['path']}")
    
    # Check specific endpoint
    question_routes = [r for r in ai_routes if '/question' in r['path']]
    
    print("\n✓ Question Endpoint Check:")
    print("-" * 60)
    if question_routes:
        for route in question_routes:
            print(f"  ✓ Found: {route['path']}")
            print(f"    Methods: {', '.join(route['methods'])}")
    else:
        print("  ✗ No /question endpoint found!")
    
    print("\n" + "=" * 60)
    print(f"Total routes: {len(routes)}")
    print(f"AI routes: {len(ai_routes)}")
    print("=" * 60)
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
